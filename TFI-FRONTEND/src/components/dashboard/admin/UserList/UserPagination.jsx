// UserPagination now delegates to the shared Pagination component.
// The idPrefix keeps element IDs unique across the dashboard.
import Pagination from '../../../shared/Pagination'

const UserPagination = ({ currentPage, totalItems, pageSize, onPageChange, onPageSizeChange }) => (
  <Pagination
    currentPage={currentPage}
    totalItems={totalItems}
    pageSize={pageSize}
    onPageChange={onPageChange}
    onPageSizeChange={onPageSizeChange}
    itemLabel="users"
    idPrefix="user-pagination"
  />
)

export default UserPagination
