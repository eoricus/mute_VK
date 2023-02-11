import React, { RefObject, useEffect, useRef, useState } from "react";
import TypeOfClientError from "../../interfaces/clientError.type";

import SettingsInterface from "../../interfaces/settings.interface";

import { Icons, Button } from "../../utils/Button";

import Users from "./pages/Users";
import Settings from "./pages/Settings";

import "./styles";

/** Previous text of error message, need because animation
 *  during about second, and when error in null need to
 *  show actual error text */
let errorPreviousText: String;
const Error = React.forwardRef(
  /**
   *
   * @param props.error
   * @param ref
   * @returns
   */
  (props: { error: TypeOfClientError; cancel: Function }, ref) => {
    let errorText;
    switch (props.error) {
      case "clientErrorFunctionBlocked":
        errorText = "Ошибка: Функция пока недоступна(";
        break;
      case "clientErrorIdContainLetters":
        errorText = "Ошибка: ID не может содержать букв";
        break;
      case "clientErrorIdTooLong":
        errorText = "Ошибка: ID слишком длинный (>16)";
        break;
      default:
        errorText = errorPreviousText || "Ты как это сделал?";
        break;
    }
    errorPreviousText = errorText;

    return (
      <div className="Error" id="Error" aria-hidden={props.error == null}>
        <span className="Error-Text">{errorText}</span>

        <Button
          icon={Icons.cancel}
          className="Error-Button Error-Button_delete"
          onClick={() => props.cancel}
        />
      </div>
    );
  }
);

interface interfaceOfMainProps {
  /** Selected tab ("Users" by default) */
  activeTab: "Users" | "Settings";

  /** User settings from chrome storage */
  settings: SettingsInterface;

  /** Function for changing tabs */
  changeTab: Function;

  /** List of users from chrome storage, which messages will hide */
  banList: string[];
}

export default function Main(props: interfaceOfMainProps) {
  const [errorRef, setErrorRef] = useState<TypeOfClientError | any>(null);
  let timerID: any; // WTF??

  /**
   * Set's the error state, and after a relevanceTime
   * returns the previous state
   *
   * @param {TypeOfClientError} errorType Types of Error
   * @param {number} relevanceTime Time after which the previous state will be returned
   */
  function setError(
    errorType: TypeOfClientError,
    relevanceTime: number = 3000
  ) {
    setErrorRef(errorType);
    timerID = setTimeout(() => {
      setErrorRef(null);
    }, relevanceTime);
  }

  useEffect(() => {
    return clearTimeout(timerID);
  });

  return (
    // It will look like "Main Main-Users _compact"
    <main
      className={`Main Main-${props.activeTab}`}
    >
      {props.activeTab == "Users" ? (
        <Users banList={props.banList} setError={setError} />
      ) : (
        <Settings settings={props.settings} setError={setError} />
      )}

      {/* // TODO Error onClick to ref */}
      <Error
        error={errorRef}
        cancel={() => {
          setError(null);
        }}
        ref={(errorRef) => setErrorRef(errorRef)}
      />
    </main>
  );
}
