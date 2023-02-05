import React from "react";

import icons from "../../utils/_icons";
import "./styles.scss";

export default class NavBar extends React.Component<{
  activeTab: String;
  changeTab: Function;
}> {
  constructor(props: { activeTab: String; changeTab: Function }) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <nav className="NavBar">
        <div
          className="Tab-slider"
          style={{
            transform:
              this.props.activeTab === "Users"
                ? "translateX(0)"
                : "translateX(184px)",
          }}
        />
        <div
          className="Tab Tab-Users"
          title="Пользователи"
          role="button"
          aria-pressed={this.props.activeTab === "Users"}
          onClick={() => {
            this.props.changeTab("Users");
          }}
        >
          <icons.Users className="Tab-icon" />
          <h2 className="Tab-title">Пользователи</h2>
        </div>

        <div
          className="Tab Tab-Settings"
          title="Настройки"
          role="button"
          aria-pressed={this.props.activeTab === "Settings"}
          onClick={() => {
            this.props.changeTab("Settings");
          }}
        >
          <icons.Settings className="Tab-icon" />
          <h2 className="Tab-title">Настройки</h2>
        </div>
      </nav>
    );
  }
}
