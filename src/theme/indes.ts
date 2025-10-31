import {
  type MantineColorsTuple,
  MultiSelect,
  Select,
  createTheme,
} from "@mantine/core";

const myColor: MantineColorsTuple = [
  "#ffebea",
  "#fbd4d4",
  "#f4a6a6",
  "#ee7575",
  "#ea4d4a",
  "#e73430",
  "#ed2e26",
  "#ed2e26",
  "#ed2e26",
  "#ed2e26",
];

export const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: "myColor",
  components: {
    Select: Select.extend({
      defaultProps: {
        nothingFoundMessage: "لا يوجد نتائج",
        limit: 50,
      },
    }),
    MultiSelect: MultiSelect.extend({
      defaultProps: {
        nothingFoundMessage: "لا يوجد نتائج",
        limit: 50,
      },
    }),
  },
});
