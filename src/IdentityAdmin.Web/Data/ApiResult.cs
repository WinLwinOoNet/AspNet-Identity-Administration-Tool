using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Reflection;
using System.Threading.Tasks;

namespace IdentityAdmin.Web.Data
{
    public class ApiResult<T>
    {
        private string _sortOrder = "ASC";

        public string SortColumn { get; set; }

        public string SortOrder
        {
            get => _sortOrder;
            set => _sortOrder =
                !string.IsNullOrWhiteSpace(value) && value.ToUpper() == "DESC"
                ? "DESC"
                : "ASC";
        }

        public string FilterColumn { get; set; }

        public string FilterQuery { get; set; }

        public List<T> Data { get; private set; }

        public int PageIndex { get; private set; }

        public int PageSize { get; private set; }

        public int TotalCount { get; private set; }

        public int TotalPages { get; private set; }

        public bool HasPreviousPage => PageIndex > 0;

        public bool HasNextPage => (PageIndex + 1) < TotalPages;

        private ApiResult(
            List<T> data,
            int count,
            int pageIndex,
            int pageSize,
            string sortColumn,
            string sortOrder,
            string filterColumn,
            string filterQuery)
        {
            Data = data;
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalCount = count;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            SortColumn = sortColumn;
            SortOrder = sortOrder;
            FilterColumn = filterColumn;
            FilterQuery = filterQuery;
        }

        public static async Task<ApiResult<T>> CreateAsync(
            IQueryable<T> source,
            int pageIndex,
            int pageSize,
            string sortColumn = null,
            string sortOrder = null,
            string filterColumn = null,
            string filterQuery = null)
        {
            if (!String.IsNullOrWhiteSpace(filterColumn)
                && !String.IsNullOrWhiteSpace(filterQuery)
                && IsValidProperty(filterColumn))
            {
                source = source.Where(
                    String.Format("{0}.Contains(@0)",
                    filterColumn),
                    filterQuery);
            }

            int count = await source.CountAsync();

            if (!String.IsNullOrWhiteSpace(sortColumn)
                && IsValidProperty(sortColumn))
            {
                source = source.OrderBy(
                    String.Format(
                        "{0} {1}",
                        sortColumn,
                        sortOrder)
                    );
            }

            source = source
                .Skip(pageIndex * pageSize)
                .Take(pageSize);

#if DEBUG
            // Retrieve the generated SQL query for debug purpose
            // var sql = source.ToSql();
#endif

            List<T> data = await source.ToListAsync();

            return new ApiResult<T>(
                data,
                count,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        public static bool IsValidProperty(
            string propertyName,
            bool throwExceptionIfNotFound = true)
        {
            var prop = typeof(T).GetProperty(
                propertyName,
                BindingFlags.IgnoreCase |
                BindingFlags.Public |
                BindingFlags.Static |
                BindingFlags.Instance);
            if (prop == null && throwExceptionIfNotFound)
                throw new NotSupportedException(String.Format("ERROR: Property '{0}' does not exist.", propertyName));

            return prop != null;
        }
    }
}
