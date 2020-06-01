using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using IdentityAdmin.Web.Data;
using IdentityAdmin.Web.Models;
using Microsoft.AspNetCore.Identity;

namespace IdentityAdmin.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;

        public RolesController(
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _roleManager = roleManager;
        }

        // GET: api/Roles
        // GET: api/Roles/?pageIndex=0&pageSize=10
        // GET: api/Roles/?pageIndex=0&pageSize=10&sortColumn=email&sortOrder=asc
        // GET: api/Roles/?pageIndex=0&pageSize=10&sortColumn=email&sortOrder=asc&filterColumn=name&filterQuery=manager
        [HttpGet]
        public async Task<ActionResult<ApiResult<RoleDto>>> Get(
            int pageIndex = 0,
            int pageSize = 10,
            string sortColumn = null,
            string sortOrder = null,
            string filterColumn = null,
            string filterQuery = null)
        {
            IQueryable<RoleDto> Roles = _context.Roles
                .Select(r => new RoleDto
                {
                    Id = r.Id,
                    Name = r.Name
                });

            return await ApiResult<RoleDto>
                .CreateAsync(
                    Roles,
                    pageIndex,
                    pageSize,
                    sortColumn,
                    sortOrder,
                    filterColumn,
                    filterQuery);
        }

        // GET: api/Roles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoleDto>> Get(string id)
        {
            IdentityRole identityRole = await _context.Roles.FindAsync(id);

            if (identityRole == null)
            {
                return NotFound();
            }

            return RoleToDto(identityRole);
        }

        // PUT: api/Roles/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, RoleDto roleDto)
        {
            if (id != roleDto.Id)
            {
                return BadRequest();
            }

            IdentityRole identityRole = await _roleManager.FindByIdAsync(id);
            if (identityRole == null)
            {
                return NotFound();
            }

            // Ensure role name is unique.
            IdentityRole otherRole = await _roleManager.FindByNameAsync(roleDto.Name);
            if (otherRole != null && otherRole.Id != identityRole.Id)
            {
                return Conflict();
            }

            identityRole.Name = roleDto.Name;

            await _roleManager.UpdateAsync(identityRole);

            return NoContent();
        }

        // POST: api/Roles
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<RoleDto>> Post(RoleDto role)
        {
            if (await _roleManager.RoleExistsAsync(role.Name))
            {
                return Conflict();
            }

            await _roleManager.CreateAsync(new IdentityRole(role.Name));

            IdentityRole identityRole = await _roleManager.FindByNameAsync(role.Name);

            return CreatedAtAction(
                nameof(this.Get),
                new { id = role.Id },
                RoleToDto(identityRole));
        }

        // DELETE: api/Roles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            IdentityRole identityRole = await _context.Roles.FindAsync(id);

            if (identityRole == null)
            {
                return NotFound();
            }

            await _roleManager.DeleteAsync(identityRole);

            return NoContent();
        }

        private static RoleDto RoleToDto(IdentityRole role) =>
            new RoleDto
            {
                Id = role.Id,
                Name = role.Name,
            };
    }
}
