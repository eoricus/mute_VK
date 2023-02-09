import React, { HTMLAttributes } from "react";
import _icons from "./_icons";

/** Icons...Lol */
export let Icons = _icons;

interface interfaceOfButtonProps extends HTMLAttributes<HTMLDivElement> {
  icon: JSX.Element;
  _ref?: React.MutableRefObject<HTMLDivElement | null>;
  // refF?: ;
}
/** TODO */
export function Button({ icon, _ref, ...params }: interfaceOfButtonProps) {
  params.className ? params.className += " IconButton" : params.className = " IconButton";
  // console.log(refF)
  return (
    <div {...params} ref={_ref}>
      {icon}
    </div>
  );
}
