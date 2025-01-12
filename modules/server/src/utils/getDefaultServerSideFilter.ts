export type GetServerSideFilterFn = () => {
  op: string;
  content: { op: string; content: { field: string; value: string[] } }[] | never[];
};

const getDefaultServerSideFilter: GetServerSideFilterFn = () => ({
  op: 'not',
  content: [],
});

export default getDefaultServerSideFilter;
