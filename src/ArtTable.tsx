
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Paginator } from "primereact/paginator";
import type { PaginatorPageChangeEvent } from "primereact/paginator";


interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

// function ArtTable: React.FC () {
const ArtTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);
  const [persistedSelection, setPersistedSelection] = useState<Map<number, Artwork>>(new Map());

  const [currentSelection, setCurrentSelection] = useState<Artwork[]>([]);

  // Fetch API data
  const fetchData = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${pageNum}`
      );
      const data = response.data;
      setArtworks(data.data);
      setTotalRecords(data.pagination.total ?? 100);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  // Handle pagination change
  const onPageChange = (e: PaginatorPageChangeEvent) => {
    const newPage = e.page + 1;
    setPage(newPage);
  };

  // Handle selection change
  const onSelectionChange = (e: { value: Artwork[] }) => {
    const selected = e.value;

    // Update persisted selection map
    const newPersisted = new Map(persistedSelection);
    artworks.forEach((item) => {
      if (selected.some((sel) => sel.id === item.id)) {
        newPersisted.set(item.id, item);
      } else {
        newPersisted.delete(item.id);
      }
    });

    setPersistedSelection(newPersisted);
    setCurrentSelection(selected);
  };

  // Remove a selected item from the persisted map
//   const
  function removeSelected(id: number) {
    const newPersisted = new Map(persistedSelection);
    newPersisted.delete(id);
    setPersistedSelection(newPersisted);
  };

  return (
    <>
        <div className="card p-4">
          <div className="selection-panel mb-3">
            <h3>Selected Rows:</h3>
            {persistedSelection.size === 0 ? (
              <p>No rows selected</p>
            ) : (
              <ul>
                {Array.from(persistedSelection.values()).map((item) => (
                  <li key={item.id} className="flex justify-content-between align-items-center mb-0.5">
                    <span>{item.title}</span>
                    <button onClick={() => removeSelected(item.id)} className="btn btn-danger p-1 m-1">Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* DataTable */}
          <DataTable className="p-1 bg-indigo-100 hover:bg-slate-200" value={artworks} loading={loading} paginator={false} selection={currentSelection} onSelectionChange={onSelectionChange} dataKey="id" responsiveLayout="scroll">
            <Column selectionMode="multiple" className="p-0.5" headerStyle={{ width: "50px" }}></Column>
            <Column className="p-1 bg-gray-50" field="title" header="Title"></Column>
            <Column className="p-1 bg-gray-50" field="place_of_origin" header="Place Of Origin"></Column>
            <Column className="p-1 bg-gray-50" field="artist_display" header="Artist Display"></Column>
            <Column className="p-1 bg-gray-50" field="date_start" header="Date Start"></Column>
            <Column className="p-1 bg-gray-50" field="date_end" header="Date End"></Column>
          </DataTable>
          {/* Paginator */}
          <Paginator first={(page - 1) * rowsPerPage} rows={rowsPerPage} totalRecords={totalRecords} rowsPerPageOptions={[6, 12, 24]}
          onPageChange={ function(event) {
    const newPage = event.page + 1;
    const newRows = event.rows;
    setPage(newPage);
    setRowsPerPage(newRows);
  }} className="mt-3 p-2 bg-indigo-100" />
        </div> 
    </>
  );
};

export default ArtTable;

// class="p-paginator-page p-paginator-element p-link p-paginator-page-start p-highlight"