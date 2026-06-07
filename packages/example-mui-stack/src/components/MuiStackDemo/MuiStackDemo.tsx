import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';

ModuleRegistry.registerModules([AllCommunityModule]);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  min-width: 320px;
`;

const rowData = [
  { name: 'Alpha', value: 1 },
  { name: 'Beta', value: 2 },
];

export type MuiStackDemoProps = {
  title?: string;
};

export default function MuiStackDemo({
  title = 'MUI + ag-grid stack',
}: MuiStackDemoProps) {
  const columnDefs = useMemo(
    () => [
      { field: 'name', flex: 1 },
      { field: 'value', width: 100 },
    ],
    [],
  );

  return (
    <Container>
      <h2>{title}</h2>
      <Button variant="contained">MUI Button</Button>
      <div className="ag-theme-alpine" style={{ width: '100%', height: 160 }}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} />
      </div>
    </Container>
  );
}
