"use client"

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Suspense } from 'react';
import Loading from "../loading";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';


const columns = [
  {field: 'name', headerName: 'Name', width: 150},
  {field: 'region', headerName: 'Region', width: 100},
  {field: 'map_wins', headerName: 'Map Wins', width: 125},
  {field: 'rounds_won', headerName: 'Round Wins', width: 125},
  {field: 'pistols', headerName: 'Pistols', width: 125},
  {field: 'ecos', headerName: 'Ecos', width: 125},
  {field: 'semi_ecos', headerName: 'Semi-Ecos', width: 125},
  {field: 'kickoff_2025_avg_fpts', headerName: 'Kickoff Fantasy Points', width: 150},
  {field: 'gp', headerName: 'Games Played', width: 100}
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