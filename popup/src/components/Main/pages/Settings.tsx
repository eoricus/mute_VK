import React, { useState } from "react";

import SettingsInterface from "../../../interfaces/settings.interface";

import { Icons, Button } from "../../../utils/Button";

export default function Settings(props: {
  settings: SettingsInterface;
  setError: Function;
}) {
  const setSettings = (property: string, value: boolean) => {
    let newSettings = props.settings;
    newSettings[property as keyof SettingsInterface] = value;

    chrome.storage.local.get(["settings"], async (data) => {
      chrome.storage.local.set({
        settings: newSettings,
      });
    });
  };

  const settingsFields: {
    title: string;
    subtitle: string;
    state: boolean;
    property: string;
    isBlocked: boolean;
  }[] = [
    {
      title: "Скрыть нижнюю панель",
      subtitle:
        "Если вдруг вы не хотите видеть мои гениальные мысли, или донатить мне(((",
      state: props.settings.isHideFooter,
      property: "isHideFooter",
      isBlocked: false,
    },
    {
      title: "Блюр",
      subtitle: "Блюрит сообщения, вместо удаления",
      state: props.settings.isBlurMode,
      property: "isBlurMode",
      isBlocked: false,
    },
    {
      title: `"Красивый" режим`,
      subtitle:
        "Позволяет отображать данные пользователей. Необходима авторизация:(",
      state: props.settings.isPrettyMode,
      property: "isPrettyMode",
      isBlocked: true,
    },
    {
      title: "Скрывать сообщения только в чатах",
      subtitle: "Оставляет сообщения в личных диалогах",
      state: props.settings.isHideOnlyInChats,
      property: "isHideOnlyInChats",
      isBlocked: true,
    },
    {
      title: "Цензура",
      subtitle: "Скрывает сообщения с определенным содержанием",
      state: props.settings.isAutoCensorship,
      property: "isAutoCensorship",
      isBlocked: true,
    },
  ];

  return (
    <>
      <div className="ListOfSettings">
        {settingsFields.map((_setting) => {
          return (
            <div
              className={`Setting ${
                _setting.state
                  ? "_active"
                  : _setting.isBlocked
                  ? "_blocked"
                  : "_unactive"
              }`}
            >
              <Button
                icon={
                  _setting.state
                    ? Icons.checkSquareOutlineActive
                    : Icons.checkSquareOutlineUnActive
                }
                className="Setting-CheckBox"
                onClick={() =>
                  _setting.isBlocked
                    ? props.setError("")
                    : setSettings(_setting.property, !_setting.state)
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
      </div>
    </>
  );
}
