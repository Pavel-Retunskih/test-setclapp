import { Grid } from "antd";
import { TableProvider } from "@entities/record";
import { ItemsTableWidget } from "@widgets/itemsTable";

const { useBreakpoint } = Grid;

function App() {
  const screens = useBreakpoint();

  return (
    <TableProvider>
      <div style={{ padding: screens.md ? 24 : 12 }}>
        <ItemsTableWidget />
      </div>
    </TableProvider>
  );
}

export default App;
