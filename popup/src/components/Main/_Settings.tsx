import React, { useState } from "react";

import icons from "../../utils/_icons";
import SettingsInterface from "../../interfaces/settings.interface";
import BanList from "./_BanList";

export default class Settings extends React.Component<
  {
    settings: SettingsInterface;
    compact: boolean;
  },
  {
    isTyping: Boolean;
    isError: boolean;
    errorType?: "BlockedFunction";
    isHoverOnErrorText?: boolean;
  }
> {
  constructor(props: { settings: SettingsInterface; compact: boolean }) {
    super(props);
    this.state = {
      isTyping: false,
      isError: false,
    };

    this.setSettings = this.setSettings.bind(this);
    this.Error = this.Error.bind(this);
  }

  setError(errorType: "BlockedFunction", clearTime: number = 3000) {
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

  Error() {
    let errorText;
    switch (this.state.errorType) {
      case "BlockedFunction":
        errorText = "Функция пока недоступна(((";
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

  setSettings(property: String, state: boolean) {
    let newSettings = this.props.settings;
    newSettings[property as keyof SettingsInterface] = !state;

    console.log(property, !state);
    console.log(newSettings);
    chrome.storage.local.get(["settings"], async (data) => {
      console.log(data);
      console.log(newSettings);
      chrome.storage.local.set({
        settings: newSettings,
      });
    });
  }

  render(): React.ReactNode {
    return (
      <main
        className={`Main Main-SettingsPage ${
          this.props.compact ? "_compact" : ""
        }`}
      >
        {/* <div className="Input">
          <div className="InputField">
            <icons.AtSign className="InputField-Icon InputField-Icon_user" />
            <input
              type="text"
              className="InputField-Input"
              id="InputUserId"
              onInput={(event: any) => {
                this.setState({ isTyping: Boolean(event.target.value) });
              }}
              placeholder="ваш токен"
            />

            <div
              className={`InputField-IconContainer ${
                this.state.isTyping ? "" : "_hide"
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
          <div className="InputSubButton InputSubButton_info">
            <icons.Info />
          </div>
        </div> */}

        <div className="SettingsField">
          {[
            {
              title: "Скрыть нижнюю панель",
              subtitle:
                "Если вдруг вы не хотите видеть мои гениальные мысли, или донатить мне(((",
              state: this.props.settings.isHideFooter,
              property: "isHideFooter",
              isBlocked: false,
            },
            {
              title: "Блюр",
              subtitle: "Блюрит сообщения, вместо удаления",
              state: this.props.settings.isBlurMode,
              property: "isBlurMode",
              isBlocked: false,
            },
            {
              title: `"Красивый" режим`,
              subtitle:
                "Позволяет отображать данные пользователей. Необходима авторизация:(",
              state: this.props.settings.isPrettyMode,
              property: "isPrettyMode",
              isBlocked: true,
            },
            {
              title: "Скрывать сообщения только в чатах",
              subtitle: "Оставляет сообщения в личных диалогах",
              state: this.props.settings.isHideOnlyInChats,
              property: "isHideOnlyInChats",
              isBlocked: true,
            },
            {
              title: "Цензура",
              subtitle: "Скрывает сообщения с определенным содержанием",
              state: this.props.settings.isAutoCensorship,
              property: "isAutoCensorship",
              isBlocked: true,
            },
          ].map((_setting) => {
            return (
              <div
                className={`Setting ${_setting.isBlocked ? "_blocked" : ""}`}
              >
                <icons.CheckBox
                  className={`Setting-CheckBox ${
                    _setting.isBlocked
                      ? "_blocked"
                      : _setting.state
                      ? "_active"
                      : ""
                  }`}
                  isActive={_setting.state}
                  onClick={() =>
                    _setting.isBlocked
                      ? this.setError("BlockedFunction")
                      : this.setSettings(_setting.property, _setting.state)
                  }
                />
                <div className="Setting-Text">
                  <h3 className="Setting-Title">
                    {_setting.isBlocked ? "*" : ""}
                    {_setting.title}
                  </h3>
                  <span className="Setting-Subtitle">{_setting.subtitle}</span>
                </div>
              </div>
            );
          })}

          {this.state.isError && <this.Error />}
        </div>
      </main>
    );
  }
}
