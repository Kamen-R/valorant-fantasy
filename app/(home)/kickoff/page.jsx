"use client"

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Suspense } from 'react';
import Loading from "../loading";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';


/*const rows: GridRowsProp = [
    {id: 1, col1: 'Demon1', col2: 'NRG Esports', col3: "Americas", col4: 40.3, col5: 10}, 
    {id: 3, col1: 't3xture', col2: 'Gen.G', col3: "Pacific", col4: 48.9, col5: 9},
    {id: 4, col1: 'Ardiis', col2: 'NAVI', col3: "EMEA", col4: 34.3, col5: 8},
];*/

// const columns: GridColDef[] = [
//     {field: 'id', headerName: 'ID'},
//     {field: 'col1', headerName: 'Name', width: 100 },
//     {field: 'col2', headerName: 'FPTS', width: 100 },
// ];

// const style = {
//   height: 300,
//   width: "50%",
//   //color: 'green',
//   //bgcolor: 'red',
// };
// const stats = await KickoffStats()

// export default function Kickoff() {

//   return (
//     <div>
//       <Suspense fallback={<Loading />}>
//       <DataGrid 
//         rows={stats}
//         columns={columns}
//       />
//       </Suspense>
//     </div>
//   )
// }
const columns = [
  {field: 'name', headerName: 'Name', width: 150},
  {field: 'team', headerName: 'Team', width: 150},
  {field: 'position', headerName: 'Pos', width: 150},
  {field: 'region', headerName: 'Region', width: 150},
  {field: 'kills', headerName: 'Kills', width: 100},
  {field: 'deaths', headerName: 'Deaths', width: 100},
  {field: 'assists', headerName: 'Assists', width: 100},
  {field: 'ACS', headerName: 'ACS', width: 100},
  {field: 'fpts', headerName: 'Fantasy Points', width: 150},
  {field: 'gp', headerName: 'Games Played', width: 150}
];

export default function Kickoff(){
  const supabase = createClientComponentClient()
  const [rows, SetRows] = React.useState([])

  React.useEffect(() => {
    const fetcher = async () => {
      const { data } = await supabase.from('Kickoff Statistics').select().neq('position', 'team')
      SetRows(data)
    }
    fetcher();
  })

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <DataGrid 
          getRowId={(row) => row.pid}
          rows={rows}
          columns={columns}
          initialState={{
            ...rows.initialState,
            pagination: { paginationModel: { pageSize: 25} },
          }}
          pageSizeOptions={[25, 50, 100]}
        />
      </Suspense>
    </div>
  )
}