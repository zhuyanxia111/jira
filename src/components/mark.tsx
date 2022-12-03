export const Mark = ({ name, keyword }: { name: string; keyword?: string }) => {
  if (!keyword) {
    return <span>{name}</span>;
  }
  const full = name.split(keyword);
  return (
    <>
      {full.map((str, index) => (
        <span key={str + index}>
          {str}
          {index === full.length - 1 ? null : (
            <span style={{ color: "#257AFD" }}>{keyword}</span>
          )}
        </span>
      ))}
    </>
  );
};
