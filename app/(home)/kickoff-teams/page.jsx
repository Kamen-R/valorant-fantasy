"use client"

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Suspense } from 'react';
import Loading from "../loading";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';


const columns = [
  {field: 'name', headerName: 'Name', width: 150},
  {field: 'region', headerName: 'Region', width: 150},
  {field: 'map wins', headerName: 'Map Wins', width: 150},
  {field: 'round wins', headerName: 'Round Wins', width: 150},
  {field: 'pistols won', headerName: 'Pistols', width: 150},
  {field: 'ecos won', headerName: 'Ecos', width: 150},
  {field: 'semi-ecos won', headerName: 'Semi-Ecos', width: 150},
  {field: 'fpts', headerName: 'Fantasy Points', width: 150},
  {field: 'gp', headerName: 'Games Played', width: 150}
];

export default function Kickoff(){
  const supabase = createClientComponentClient()
  const [rows, SetRows] = React.useState([])

  React.useEffect(() => {
    const fetcher = async () => {
      const { data } = await supabase.from('Kickoff Statistics').select().eq('position', 'team')
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
            pagination: { paginationModel: { pageSize: 10} },
          }}
          pageSizeOptions={[10, 33]}
        />
      </Suspense>
    </div>
  )
}