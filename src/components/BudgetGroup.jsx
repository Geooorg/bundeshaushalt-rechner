import Row from "./Row.jsx";
import SectionHeader from "./SectionHeader.jsx";
import { SOURCE_LIST } from "../data/sources.js";

export default function BudgetGroup({ items, section, values, onChange, color, total, description, title, negative }) {
  const groupItems = items.filter((i) => i.section === section);
  const groupTotal = groupItems.reduce((s, i) => s + values[i.id], 0);
  const sourceKeys = [...new Set(groupItems.map((i) => i.sourceKey))];
  const sources = sourceKeys
    .map((key) => SOURCE_LIST.find((s) => s.key === key))
    .filter(Boolean);

  return (
    <>
      <SectionHeader title={title} total={groupTotal} color={color} description={description} sources={sources} section={section} />
      {groupItems.map((item) => (
        <Row
          key={item.id}
          item={item}
          value={values[item.id]}
          onChange={onChange}
          color={color}
          total={total}
          negative={negative}
        />
      ))}
    </>
  );
}
