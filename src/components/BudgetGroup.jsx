import Row from "./Row.jsx";
import SectionHeader from "./SectionHeader.jsx";

export default function BudgetGroup({ items, section, values, onChange, color, total, description, title, negative }) {
  const groupItems = items.filter((i) => i.section === section);
  const groupTotal = groupItems.reduce((s, i) => s + values[i.id], 0);

  return (
    <>
      <SectionHeader title={title} total={groupTotal} color={color} description={description} />
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
