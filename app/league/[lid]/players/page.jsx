"use client"

import * as React from 'react';
// import PlayerStats from "./PlayerStats";
import { Suspense } from 'react';
import Loading from "../../../(home)/loading";
import { DataGrid } from '@mui/x-data-grid';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/* const style = {
  height: 300,
  width: "50%",
  //color: 'green',
  //bgcolor: 'red',
}; 

export default function Players() {
    return (
      <main>
        <h2>Player Statistics</h2>
        <Suspense fallback={<Loading />}>
          <PlayerStats />
        </Suspense>
      </main>
    );
} */

const columns = [
  {field: 'name', headerName: 'Name', width: 150 },
  {field: 'team', headerName: 'Team', width: 150 },
  {field: 'region', headerName: 'Region', width: 150},
];

export default function Players(){
  const supabase = createClientComponentClient()
  const [rows, SetRows] = React.useState([])

  React.useEffect(() => {
    const fetcher = async () => {
      const { data } = await supabase.from('Players').select()
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
        />
      </Suspense>
    </div>
  )
}