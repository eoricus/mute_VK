import React, { RefObject, useEffect, useRef, useState } from "react";
import TypeOfClientError from "../../../interfaces/clientError.type";

import SettingsInterface from "../../../interfaces/settings.interface";

import { Icons, Button } from "../../../utils/Button";

export default function Users(props: {
  banList: string[];
  setError: Function;
}) {
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const inputUserId = useRef<HTMLInputElement | null>(null);

  const buttonAddUserInBanList = useRef<HTMLDivElement | null>(null);

  const buttonClearInput = useRef<HTMLDivElement | null>(null);

  const buttonClearBanList = useRef<HTMLDivElement | null>(null);

  const refsForUsersTags = useRef<HTMLDivElement | any>([]);
  refsForUsersTags.current = [...new Set(props.banList)].map(
    (element, index) => {
      return refsForUsersTags.current[index] || React.createRef();
    }
  );

  useEffect(() => {
    /** Checks the value entered by the user, and if it is
     *  containt anything but numbers, returns the value in
     *  the input field to the previous state */
    inputUserId.current?.addEventListener("input", (event: Event) => {
      setIsTyping(Boolean(inputUserId.current!.value));
      if (!/^\d+$/.test(inputUserId.current!.value)) {
        if (event.preventDefault) event.preventDefault();
        props.setError("clientErrorIdContainLetters");
      }
    });

    /** Clears the input field of all characters */
    buttonClearInput.current?.addEventListener("click", (event: MouseEvent) => {
      inputUserId.current!.value = "";
      setIsTyping(Boolean(inputUserId.current!.value));
    });

    /** Adds the value entered in the input field to
     *  chrome.storage, checking it for errors beforehand
     *  (presence of characters except digits, and length)*/
    buttonAddUserInBanList.current?.addEventListener(
      "click",
      (event: MouseEvent) => {
        let userID = inputUserId.current!.value;

        if (!/^\d+$/.test(userID)) {
          props.setError("clientErrorIdContainLetters");
        } else if (userID.length >= 16) {
          props.setError("clientErrorIdTooLong");
        } else {
          chrome.storage.local.get(["banList"], async (data) => {

            chrome.storage.local.set({
              banList:
                Object.keys(data).length == 0
                  ? [userID]
                  : [...data.banList, userID],
            });
            setIsTyping(false);
            inputUserId.current!.value = "";
          });
        }
      }
    );

    /** Delete all id's from banList in chr */
    buttonClearBanList.current?.addEventListener(
      "click",
      (event: MouseEvent) => {
        if (
          props.banList.length != 0
          // confirm("Очистить список заблокированных пользователей?")
        ) {
          chrome.storage.local.set({ banList: [] });
        }
      }
    );

    /** Set event listener for click event, realize deleting
     *  appropriate id from chrome.storage */
    refsForUsersTags.current.map((element: any, i: number) => {
      element.current.addEventListener("click", (event: MouseEvent) => {
        chrome.storage.local.set({
          banList: props.banList.filter((element) => {
            return element != props.banList[i];
          }),
        });
      });
    });
  });

  return (
    <>
      <div className="Input Input_ID">
        <div className="InputField">
          <Button
            icon={Icons.userOutline}
            className=" InputField-Icon InputField-Icon_user"
          />
          <input
            className="InputField-Input"
            type="text"
            ref={inputUserId}
            placeholder="id пользователя"
          />
          <div
            className={`InputField-IconContainer ${
              isTyping ? "" : "InputField-IconContainer_hide"
            }`}
          >
            <Button
              icon={Icons.add}
              className=" InputField-Icon InputField-Icon_plus"
              _ref={buttonAddUserInBanList}
            />

            <Button
              icon={Icons.minus}
              className=" InputField-Icon InputField-Icon_minus"
              _ref={buttonClearInput}
            />
          </div>
        </div>
        <div className="Input-SubButton Input-SubButton_clearBanList">
          <Button icon={Icons.deleteOutline} _ref={buttonClearBanList} />
        </div>
      </div>

      {props.banList.length == 0 ? (
        <div className="ListOfUsers ListOfUsers-Empty">
          <span className="ListOfUsers-Notice">
            Пусто! Вы пока никого не забанили! Для этого нужно ввести id
            пользователя в поле выше, или же нажать&ensp;
            {<Button icon={Icons.hide} />}&ensp;рядом с сообщением пользователя
          </span>
        </div>
      ) : (
        <div className="ListOfUsers">
          {[...new Set(props.banList)].map((userID, i) => {
            return (
              <div className="UserIDTag">
                <Button
                  icon={Icons.cancel}
                  className=" UserIDTag-Button_delete"
                  _ref={refsForUsersTags.current[i]}
                />
                <div className="UserIDTag-Text_id">id{userID}</div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
