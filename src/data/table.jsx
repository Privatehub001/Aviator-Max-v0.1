import React from "react";
import { useTable, useSortBy } from "react-table";
import classnames from "classnames";
import "./_table.scss";


const Table = ({
    columns,
    data = [],
    tableClass,
    theadClass,
    trClass,
    thClass,
    divClass,
    hiddenColumns = [],
    isDataLoading = false,
}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            initialState: { hiddenColumns }
        },
        useSortBy,
    )

    return (
        <React.Fragment>
            <div className={classnames("table-container bordered", divClass)}>
                <table {...getTableProps()}
                    className={classnames(
                        "table align-middle", tableClass
                    )}
                >
                    <thead className="table-head">
                        {headerGroups.map((headerGroup) => (
                            <tr className={trClass} key={headerGroup.id}
                                {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => {
                                    return (
                                        <th key={column.id}
                                            className={classnames("text-nowrap",
                                                column.columnClassName,
                                            )}
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                        >
                                            <span className="d-flex aling-items-center">
                                                {column.render("Header")}
                                            </span>
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>

                    <tbody {...getTableBodyProps()}>
                        {rows.length > 0 ? rows.map((row) => {
                            prepareRow(row);
                            return (
                                <React.Fragment key={row.getRowProps().key}>
                                    <tr className="row">
                                        {row.cells.map((cell) => {
                                            return (
                                                <td key={cell.row.id} className={classnames(cell?.column?.columnClassName)} {...cell.getCellProps()}
                                                style={{backgroundColor:cell.row.original.win>0&&'green',
                                                    textAlign:'center',
                                                    color:cell.row.original.win>0&&cell.column.id==='multiplyer'&&'yellow'
                                                }}>
                                                    
                                                    {cell.render("Cell")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </React.Fragment>
                            );
                        }) : <tr><td className="no_hover p-0" colSpan={columns.length}>
                        </td>
                        </tr>
                        }
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
};

export default Table;

export function DefaultTable({
    data = [],
    columnCount = 0,
    accessors = []
}) {
    <div className="table-container">
        <table className="table align-middle">
            <tbody>
                {data.length > 0 ? data.map((row) => {
                    return (
                        <tr>
                            {accessors.map(item => <td key={row.id}>
                                {row[item] || "n/a"}
                            </td>)}
                        </tr>
                    );
                }) : <tr><td className="no_hover p-0" colSpan={columnCount}>
                </td>
                </tr>
                }
            </tbody>
        </table>
    </div>
}
