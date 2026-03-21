import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  user-select: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    color: ${({ $sortable, theme }) => $sortable && theme.colors.textPrimary};
    background: ${({ $sortable, theme }) => $sortable && theme.colors.bgHover};
  }
`;

const ThContent = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.bgHover}; }
  ${({ $selected, theme }) => $selected && `background: ${theme.colors.brandPrimary}08;`}
`;

const Td = styled.td`
  padding: 14px 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
  vertical-align: middle;
  white-space: ${({ $noWrap }) => ($noWrap ? 'nowrap' : 'normal')};
`;

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.textTertiary};
    margin: 8px 0 0;
  }
`;

const EmptyEmoji = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.xl} ${({ theme }) => theme.borderRadius.xl};
`;

const PageInfo = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PageButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const PageBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.brandPrimary : theme.colors.border};
  background: ${({ $active, theme }) => $active ? theme.colors.brandPrimary : 'transparent'};
  color: ${({ $active, theme }) => $active ? 'white' : theme.colors.textSecondary};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled):not([data-active]) {
    background: ${({ theme }) => theme.colors.bgHover};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  &:disabled { opacity: 0.4; }
`;

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyText = 'No data found',
  emptyEmoji = '📋',
  pageSize = 10,
  showPagination = true,
  selectedRows = [],
  onRowClick,
}) => {
  const [sort, setSort] = useState({ key: null, dir: 'asc' });
  const [page, setPage] = useState(1);

  const toggleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
    setPage(1);
  };

  // Sort data
  let sorted = [...data];
  if (sort.key) {
    sorted.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av < bv) return sort.dir === 'asc' ? -1 : 1;
      if (av > bv) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = showPagination ? sorted.slice((page - 1) * pageSize, page * pageSize) : sorted;

  const SortIcon = ({ colKey }) => {
    if (sort.key !== colKey) return <ChevronsUpDown />;
    return sort.dir === 'asc' ? <ChevronUp /> : <ChevronDown />;
  };

  return (
    <TableWrapper>
      <StyledTable>
        <Thead>
          <tr>
            {columns.map((col) => (
              <Th
                key={col.key}
                $sortable={col.sortable}
                onClick={() => col.sortable && toggleSort(col.key)}
                style={col.width ? { width: col.width } : {}}
              >
                <ThContent>
                  {col.label}
                  {col.sortable && <SortIcon colKey={col.key} />}
                </ThContent>
              </Th>
            ))}
          </tr>
        </Thead>
        <Tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Tr key={i}>
                {columns.map((col) => (
                  <Td key={col.key}>
                    <div style={{ height: 14, background: '#e2e8f0', borderRadius: 4, width: '70%' }} />
                  </Td>
                ))}
              </Tr>
            ))
          ) : paginated.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState>
                  <EmptyEmoji>{emptyEmoji}</EmptyEmoji>
                  <p>{emptyText}</p>
                </EmptyState>
              </td>
            </tr>
          ) : (
            paginated.map((row, i) => (
              <Tr
                key={row.id || i}
                $selected={selectedRows.includes(row.id)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col) => (
                  <Td key={col.key} $noWrap={col.noWrap}>
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </Td>
                ))}
              </Tr>
            ))
          )}
        </Tbody>
      </StyledTable>

      {showPagination && totalPages > 1 && (
        <PaginationWrapper>
          <PageInfo>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, data.length)} of{' '}
            {data.length}
          </PageInfo>
          <PageButtons>
            <PageBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              ‹
            </PageBtn>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const p = i + 1;
              return (
                <PageBtn key={p} $active={p === page} onClick={() => setPage(p)}>
                  {p}
                </PageBtn>
              );
            })}
            <PageBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              ›
            </PageBtn>
          </PageButtons>
        </PaginationWrapper>
      )}
    </TableWrapper>
  );
};

export default Table;
