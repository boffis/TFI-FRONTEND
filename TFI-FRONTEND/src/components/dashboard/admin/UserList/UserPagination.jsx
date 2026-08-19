// Thin wrapper over the shared Pagination; idPrefix keeps element IDs unique.
import Pagination from '../../../shared/Pagination'

const UserPagination = ({ currentPage, totalItems, pageSize, onPageChange, onPageSizeChange }) => (
  <Pagination
    currentPage={currentPage}
    totalItems={totalItems}
    pageSize={pageSize}
    onPageChange={onPageChange}
    onPageSizeChange={onPageSizeChange}
    itemLabel="usuarios"
    idPrefix="user-pagination"
  />
)

export default UserPagination
