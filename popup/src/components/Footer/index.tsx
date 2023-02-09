import React from "react";

import { Icons, Button } from "../../utils/Button";
import "./styles.scss";

class Footer extends React.Component<{
  hide: boolean;
}> {
  constructor(props: { hide: boolean }) {
    super(props);
  }
  componentDidMount(): void {}

  render(): React.ReactNode {
    return (
      <footer className={`Footer ${this.props.hide ? "_hide" : ""}`}>
        <div className="Footer-Signature">
          Сделано с любовью by <a href="t.me/eoricus">Eoricus</a>
        </div>
        <div className="Footer-Marquee">
          <span className="Footer-Marquee_Wrapper">
            <span className="Footer-Marquee_Item">
              Проблемы нормальных людей: проблемы Проблемы москвичей: слишком
              быстро выпил флэт уайт, и теперь неловко находится в кофейне
            </span>
          </span>
        </div>
        <div className="Footer-Icon">
          <Button
            icon={Icons.cupOfCoffee}
            className="Footer-IconButton"
          />
        </div>
      </footer>
    );
  }
}

export default Footer;
