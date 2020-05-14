using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AspIdAdmin.Web.Data;
using AspIdAdmin.Web.Models;

namespace AspIdAdmin.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        // GET: api/Users/?pageIndex=0&pageSize=10
        // GET: api/Users/?pageIndex=0&pageSize=10&sortColumn=email&sortOrder=asc
        // GET: api/Users/?pageIndex=0&pageSize=10&sortColumn=email&sortOrder=asc&filterColumn=email&filterQuery=admin@example.com
        [HttpGet]
        public async Task<ActionResult<ApiResult<UserDto>>> GetUsers(
            int pageIndex = 0, 
            int pageSize = 10,
            string sortColumn = null,
            string sortOrder = null,
            string filterColumn = null,
            string filterQuery = null)
        {
            IQueryable<UserDto> users = _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Email = u.Email,
                    EmailConfirmed = u.EmailConfirmed,
                    PhoneNumber = u.PhoneNumber,
                    PhoneNumberConfirmed = u.PhoneNumberConfirmed,
                    TwoFactorEnabled = u.TwoFactorEnabled,
                    LockoutEnd = u.LockoutEnd,
                    LockoutEnabled = u.LockoutEnabled,
                    AccessFailedCount = u.AccessFailedCount
                });

            return await ApiResult<UserDto>
                .CreateAsync(
                    users,
                    pageIndex,
                    pageSize,
                    sortColumn,
                    sortOrder,
                    filterColumn,
                    filterQuery);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUsers(string id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return ToUserDto(user);
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserDto(string id, UserDto userDto)
        {
            if (id != userDto.Id)
            {
                return BadRequest();
            }

            _context.Entry(userDto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<UserDto>> PostUserDto(UserDto userDto)
        {
            /*_context.User.Add(userDto);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserExists(userDto.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }*/

            return CreatedAtAction("GetUserDto", new { id = userDto.Id }, userDto);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserDto>> DeleteUserDto(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return ToUserDto(user);
        }

        private bool UserExists(string id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        private UserDto ToUserDto(ApplicationUser user)
        {
            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                EmailConfirmed = user.EmailConfirmed,
                PhoneNumber = user.PhoneNumber,
                PhoneNumberConfirmed = user.PhoneNumberConfirmed,
                TwoFactorEnabled = user.TwoFactorEnabled,
                LockoutEnd = user.LockoutEnd,
                LockoutEnabled = user.LockoutEnabled,
                AccessFailedCount = user.AccessFailedCount
            };
        }
    }
}
