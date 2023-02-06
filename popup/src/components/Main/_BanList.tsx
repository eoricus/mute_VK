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
    errorType?: "noDigitalID" | "tooLongID";
    isHoverOnErrorText?: boolean;
  }
> {
  constructor(props: { banList: String[]; compact: boolean }) {
    super(props);
    this.state = {
      isTyping: false,
      isError: false,
    };

    this.Error = this.Error.bind(this);
    this.setError = this.setError.bind(this);
  }

  Error() {
    let errorText;
    switch (this.state.errorType) {
      case "noDigitalID":
        errorText = "ID может содержать только цифры";
        break;
      case "tooLongID":
        errorText = "Слишком длинный ID (больше 16 цифр)";
        break;
      default:
        errorText = "Неизвестная ошибка";
        break;
    }

    return (
      <div className="Error" id="Error">
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

  setError(errorType: "noDigitalID" | "tooLongID", clearTime: number = 3000) {
    this.setState({
      isError: true,
      errorType: errorType,
    });

    setTimeout(() => {
      this.setState({
        isError: false,
        errorType: undefined,
      });
    }, clearTime);
  }

  componentDidMount(): void {
    const ElementInputUserId: HTMLInputElement = document.getElementById(
      "InputUserId"
    ) as HTMLInputElement;

    ElementInputUserId.addEventListener("keypress", (event) => {
      if (!/[0-9]|\./.test(event.key)) {
        event.returnValue = false;
        if (event.preventDefault) event.preventDefault();
        this.setError("noDigitalID");
      }
    });

    document
      .getElementById("clearInputField")
      ?.addEventListener("click", (event: MouseEvent) => {
        ElementInputUserId.value = "";
      });

    document
      .getElementById("addUserId")
      ?.addEventListener("click", (event: MouseEvent) => {
        let userID = ElementInputUserId.value;

        /** the entered id must contain only numbers, else  */
        if (!/^\d+$/.test(userID)) {
          this.setError("noDigitalID");
        } else if (userID.length >= 16) {
          this.setError("tooLongID");
        } else {
          chrome.storage.local.get(["banList"], async (data) => {
            chrome.storage.local.set({
              banList:
                Object.keys(data).length == 0
                  ? [userID]
                  : [...data.banList, userID],
            });
          });
          this.setState({
            isTyping: false,
          });
          ElementInputUserId.value = "";
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
      });
  }

  render(): React.ReactNode {
    return (
      <main
        className={`Main Main-BanListPage ${
          this.props.compact ? "_compact" : ""
        }`}
      >
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
            <div className="BanList_users">
            {this.props.banList.map((id) => {
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
            })}</div>
          )}
        </div>

        {this.state.isError && <this.Error />}
      </main>
    );
  }
}
