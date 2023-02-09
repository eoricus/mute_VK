// import { Icon12Message, Icon24Palette } from ;
import React from "react";

import { Icons, Button } from "../../utils/Button";
import "./styles.scss";

class Header extends React.Component<{ changeTheme: Function }> {
  constructor(props: { changeTheme: Function }) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <header className="Header">
        <div className="Header-Name">
          <Button
            icon={Icons.favicon}
            className="Header-Favicon"
            title="muteVK"
          />

          <h1 className="Header-Tittle">mute_vk</h1>
        </div>

        <div className="Header-Options">
          <Button
            icon={Icons.messageOutline}
            className="Header-Icon"
            title="Отправить пожелания"
            onClick={() => {
              chrome.tabs.create({ url: "https://vk.me/mute_vk" });
            }}
          />
          <Button
            icon={Icons.paletteOutline}
            className="Header-Icon"
            title="Тема приложения"
            onClick={() => this.props.changeTheme()}
          />
        </div>
      </header>
    );
  }
}

export default Header;
