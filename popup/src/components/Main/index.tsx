import React from "react";
import SettingsInterface from "../../interfaces/settings.interface";

import BanListPage from "./_BanList";
import SettingsPage from "./_Settings";

export default class Main extends React.Component<
  {
    activeTab: "Users" | "Settings";
    settings: SettingsInterface;
    changeTab: Function;
    banList: String[];
  },
  {}
> {
  constructor(props: {
    activeTab: "Users" | "Settings";
    settings: SettingsInterface;
    changeTab: Function;
    banList: String[];
  }) {
    super(props);
  }

  render(): React.ReactNode {
    switch (this.props.activeTab) {
      case "Users":
        return <BanListPage banList={this.props.banList}/>;
      case "Settings":
        return <SettingsPage settings={this.props.settings}/>;
    }
  }
}
