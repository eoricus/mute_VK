import React from "react";

import Header from "./components/Header";
import NavBar from "./components/NavBar";
import Main from "./components/Main";
import Footer from "./components/Footer";
import SettingsInterface from "./interfaces/settings.interface";

const settingsByDefault: SettingsInterface = {
  isPrettyMode: false,
  isBlurMode: false,
  isHideOnlyInChats: false,
  isAutoCensorship: false,
  isHideFooter: false
};

class App extends React.Component<
  {},
  {
    activeTab: "Users" | "Settings";
    banList?: string[];
    settings?: SettingsInterface;
    darkMode: boolean;
  }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      activeTab: "Users",
      darkMode: false,
    };
    this.changeTab = this.changeTab.bind(this);
  }

  async init(): Promise<SettingsInterface> {
    let storage = await chrome.storage.local.get(["banList", "settings"]);
    let settings: SettingsInterface = storage.settings,
      banList: string[] = storage.banList;

    if (!settings) {
      settings = settingsByDefault;
      await chrome.storage.local.set({ settings: settings });
    } else {
      settings = {
        isPrettyMode: settings.isPrettyMode || settingsByDefault.isPrettyMode,
        isBlurMode: settings.isBlurMode || settingsByDefault.isBlurMode,
        isHideOnlyInChats:
          settings.isHideOnlyInChats || settingsByDefault.isHideOnlyInChats,
        isAutoCensorship:
          settings.isAutoCensorship || settingsByDefault.isAutoCensorship,
        isHideFooter:
          settings.isHideFooter || settingsByDefault.isHideFooter
      };
    }
    this.setState({ settings: settings, banList: banList });

    return settings;
  }

  async componentDidMount(): Promise<void> {
    await this.init();
    chrome.storage.onChanged.addListener((changes, namespace) => {
      console.log(changes)
      if (namespace == "local") {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
          if (key == "banList") {
            this.setState({ banList: newValue });
          } else if (key == "settings") {
            this.setState({ settings: newValue });
          }
        }
      }
    });

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
      this.setState({ darkMode: true });
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      this.setState({ darkMode: false });
    }
  }

  /**
   * Change active tab in component state
   *
   * @param {"Users" | "Settings"} tabName
   * Name of tab, that was activated by the user
   */
  changeTab(tabName: "Users" | "Settings") {
    this.setState({
      activeTab: tabName,
    });
  }

  render(): React.ReactNode {
    return (
      <>
        <Header
          changeTheme={() => {
            console.log(this.state.darkMode);
            document.documentElement.setAttribute("data-theme", !this.state.darkMode ? "light" : "dark");
            this.setState({ darkMode: !this.state.darkMode });
          }}
        />

        <div id="containerForNavBarAndMain">
          <NavBar activeTab={this.state.activeTab} changeTab={this.changeTab} />
          <Main
            activeTab={this.state.activeTab}
            settings={this.state.settings || settingsByDefault}
            changeTab={this.changeTab}
            banList={this.state.banList || []}
          />
        </div>

        <Footer hide={this.state.settings?.isHideFooter || false}/>
      </>
    );
  }
}

export default App;
