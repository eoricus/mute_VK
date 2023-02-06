import React from "react";

import "./styles.scss";

import icons from "../../utils/_icons";
import SettingsInterface from "../../interfaces/settings.interface";

const userTab = () => {
  return <div></div>;
};

export default class BanList extends React.Component<
  {
    banList: String[];
    compact: boolean;
  },
  {
    isTyping: boolean;
    isError: boolean;
    errorType?: "noDigitalID";
    isHoverOnErrorText?: boolean;
  }
> {
  constructor(props: { banList: String[],  compact: boolean; }) {
    super(props);
    this.state = {
      isTyping: false,
      isError: false,
    };

    this.Error = this.Error.bind(this);
  }

  Error() {
    let errorText;
    switch (this.state.errorType) {
      case "noDigitalID":
        errorText = "ID может содержать только цифры";
        break;
      default:
        errorText = "Неизвестная ошибка";
        break;
    }

    return (
      <div className="Error">
        <span className="Error-Text">{errorText}</span>

        <icons.Cancel
          className="Error-Button Error-Button_delete"
          onClick={() => {
            this.setState({
              isError: false,
              errorType: undefined,
            });
          }}
        />
      </div>
    );
  }

  componentDidMount(): void {
    const ElementInputUserId: HTMLInputElement = document.getElementById(
      "InputUserId"
    ) as HTMLInputElement;

    document
      .getElementById("clearInputField")
      ?.addEventListener("click", (event: MouseEvent) => {
        ElementInputUserId.value = "";
        this.setState({
          isTyping: false,
          isError: false,
          errorType: undefined,
        });
      });

    document
      .getElementById("addUserId")
      ?.addEventListener("click", (event: MouseEvent) => {
        let userID = ElementInputUserId.value;

        /** the entered id must contain only numbers, else  */
        if (/^\d+$/.test(userID)) {
          chrome.storage.local.get(["banList"], async (data) => {
            chrome.storage.local.set({
              banList:
                Object.keys(data).length == 0
                  ? [userID]
                  : [...data.banList, userID],
            });
          });
          ElementInputUserId.value = "";
          this.setState({
            isTyping: false,
            isError: false,
            errorType: undefined,
          });
        } else {
          this.setState({
            isError: true,
            errorType: "noDigitalID",
          });
        }
      });

    document
      .getElementById("clearBanList")
      ?.addEventListener("click", (event: MouseEvent) => {
        if (
          this.props.banList.length != 0 &&
          confirm("Очистить список заблокированных пользователей?")
        ) {
          chrome.storage.local.set({ banList: [] });
        }

        this.setState({
          isTyping: false,
          isError: false,
          errorType: undefined,
        });
      });
  }

  render(): React.ReactNode {
    return (
      <main className={`Main Main-BanListPage ${this.props.compact ? "_compact" : ""}`}>
        {/* Settings Field */}
        <div className="Input">
          <div className="InputField">
            <icons.User className="InputField-Icon InputField-Icon_user" />
            <input
              type="text"
              className="InputField-Input"
              id="InputUserId"
              onInput={(event: any) => {
                this.setState({ isTyping: Boolean(event.target.value) });
              }}
              placeholder="id пользователя"
            />

            <div
              className={`InputField-IconContainer ${
                !this.state.isTyping && "_hide"
              }`}
            >
              <icons.Plus
                className="InputField-Icon InputField-Icon_plus"
                id="addUserId"
              />
              <icons.Minus
                className="InputField-Icon InputField-Icon_minus"
                id="clearInputField"
              />
            </div>
          </div>
          <div className="InputSubButton InputSubButton_clearBanList">
            <icons.Trash id="clearBanList" />
          </div>
        </div>

        <div className="BanList">
          {this.props.banList.length == 0 ? (
            <div className="BanList_empty">
              Пусто! Вы пока никого не забанили
            </div>
          ) : (
            this.props.banList.map((id) => {
              return (
                <div className="UserID">
                  <icons.Cancel
                    className="UserID-Button_delete"
                    onClick={() => {
                      chrome.storage.local.set({
                        banList: this.props.banList.filter((element, index) => {
                          return element != id;
                        }),
                      });
                    }}
                  />
                  <div className="UserID-Text_id">id{id}</div>
                </div>
              );
            })
          )}
        </div>

        {this.state.isError && <this.Error />}
      </main>
    );
  }
}
