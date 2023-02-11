import React, { useCallback, useEffect, useRef, useState } from "react";

import { Icons, Button } from "../../utils/Button";
import "./styles.scss";

export default function Footer(props: { hide: boolean }) {
  const [news, setNews] = useState<string[]>(); // TODO
  const refCupOfCoffee = useRef<HTMLDivElement | null>(null);
  const refLinkToTelegram = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    refCupOfCoffee.current?.addEventListener("click", () => {
      chrome.tabs.create({ url: "https://pay.cloudtips.ru/p/bfdaa112" });
    });

    refLinkToTelegram.current?.addEventListener("click", () => {
      chrome.tabs.create({ url: "t.me/eoricus" });
    });
  });

  return (
    <footer className={`Footer ${props.hide ? "_hide" : ""}`}>
      <div className="Footer-Signature">
        C любовью by{" "}
        <span
          role="link"
          style={{ fontStyle: "inherit" }}
          ref={refLinkToTelegram}
        >
          Eoricus
        </span>
      </div>
      <div className="Footer-Marquee">
        <span className="Footer-Marquee_Wrapper">
          <span className="Footer-Marquee_Item">
            Проблемы нормальных людей: проблемы Проблемы москвичей: слишком
            быстро выпил флэт уайт, и теперь неловко находится в кофейне
          </span>
        </span>
      </div>

      <Button
        icon={Icons.cupOfCoffee}
        className="Footer-Icon Footer-Icon_CupOfCoffee"
        _ref={refCupOfCoffee}
      />
    </footer>
  );
}
