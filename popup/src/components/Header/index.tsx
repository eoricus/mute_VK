import React from "react";

import icons from "../../utils/_icons";
import "./styles.scss";

class Header extends React.Component<{changeTheme: Function}> {
  constructor(props: {changeTheme: Function}) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <header className="Header">
        <div className="Header-Name">
          <icons.Favicon className="Header-Favicon" title="muteVK" />

          <h1 className="Header-Tittle">mute_vk</h1>
        </div>

        <div className="Header-Options">
          <icons.Message
            className="Header-Icon"
            title="Отправить пожелания"
            onClick={() => {
              chrome.tabs.create({ url: "https://vk.me/mute_vk" });
            }}
          />
          <icons.Palette className="Header-Icon" title="Тема приложения" onClick={() => this.props.changeTheme()}/>
        </div>
      </header>
    );
  }
}

export default Header;
