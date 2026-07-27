import React from "react";
import { Attribute } from "@/components/Attribute";
import { useTranslation } from "react-i18next";

export function Sticker(): React.JSX.Element {
  const { t } = useTranslation();
  const keys = ["email"] as const;

  return (
    <div id="sticker" className="fixed hidden sm:flex flex-col bottom-0 left-0 backdrop-blur-md">
      {keys.map((key) => (
        <Attribute
          key={key}
          label={t(`contact.list.${key}.label`)}
          value={t(`contact.list.${key}.value`)}
          href={t(`contact.list.${key}.href`)}
        />
      ))}
    </div>
  );
}
