import React, { useState } from "react";

interface Props {
  title: string;
  children: any
}
export default function CollapsableExample({ title, children }: Props) {
  const [collapsed, setCollapsed] = useState(true);
  return (
  <div className="border-l-red-700 border-l-4">
    <div className="">
    <button onClick={() => setCollapsed(!collapsed)} className="bg-red-100 w-full hover:bg-red-300 transition px-4 py-2">
      <div className="text-xl font-bold text-left text-gray-900">{title}</div>
      <div className="text-sm text-left">
        click to {collapsed ? 'open' : 'close'} example
      </div>
    </button>
    <div className={`mt-4 ml-4 overflow-hidden ${collapsed ?  'hidden' : 'block'}`}>
      {children}
    </div>
    </div>
  </div>);
}
