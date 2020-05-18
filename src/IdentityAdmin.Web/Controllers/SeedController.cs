using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityAdmin.Web.Data;
using IdentityAdmin.Web.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace IdentityAdmin.Web.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _env;

        public SeedController(
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IWebHostEnvironment env)
        {
            _context = context;
            _roleManager = roleManager;
            _userManager = userManager;
            _env = env;
        }

        public async Task<ActionResult> CreateUsers()
        {
            if (!_env.IsDevelopment())
                return BadRequest();

            const string administratorRole = "Administrator";
            const string password = "Pa$$w0rd";

            var administrators = new List<(string FisrtName, string LastName, string Email)>
            {
                ("Ava", "Mills", "ava.mills@example.com"),
                ("Dylan", "MacLeod", "dylan.macleod@example.com"),
                ("Angela", " Lambert", "angela.lambert@example.com"),
                ("Amelia", " Vaughan", "amelia.vaughan@example.com"),
                ("Carl", " Slater", "carl.slater@example.com"),
            };

            var users = new List<(string FisrtName, string LastName, string Email)>
            {
                ("Lillian", "Simpson", "lillian.simpson@example.com"),
                ("Adam", " Quinn", "adam.quinn@example.com"),
                ("Brian", "Hughes", "brian.hughes@example.com"),
                ("Jake", " Brown", "jake.brown@example.com"),
                ("David", "Short", "david.short@example.com"),
                ("Lillian", "Robertson", "lillian.robertson@example.com"),
                ("Piers", "Hardacre", "piers.hardacre@example.com"),
                ("Mary", " Hart", "mary.hart@example.com"),
                ("Victoria", " Kelly", "victoria.kelly@example.com"),
                ("Nathan", " Alsop", "nathan.alsop@example.com"),
                ("Adrian", "Bailey", "adrian.bailey@example.com"),
                ("Michael", "Simpson", "michael.simpson@example.com"),
                ("Ian", "Sutherland", "ian.sutherland@example.com"),
                ("Jack", " Lawrence", "jack.lawrence@example.com"),
                ("Penelope", "Thomson", "penelope.thomson@example.com")
            };

            List<ApplicationUser> addedUserList = new List<ApplicationUser>();

            // Create administrator role
            if (await _roleManager.FindByNameAsync(administratorRole) == null)
                await _roleManager.CreateAsync(new IdentityRole(administratorRole));

            // Create administrators
            foreach (var administrator in administrators)
            {
                if (await _userManager.FindByEmailAsync(administrator.Email) == null)
                {
                    ApplicationUser applicationUser = new ApplicationUser
                    {
                        SecurityStamp = Guid.NewGuid().ToString(),
                        UserName = administrator.Email,
                        Email = administrator.Email
                    };

                    await _userManager.CreateAsync(applicationUser, password);
                    await _userManager.AddToRoleAsync(applicationUser, administratorRole);

                    applicationUser.EmailConfirmed = true;
                    applicationUser.LockoutEnabled = false;

                    addedUserList.Add(applicationUser);
                }
            }

            // Create users
            foreach (var user in users)
            {
                if (await _userManager.FindByEmailAsync(user.Email) == null)
                {
                    ApplicationUser applicationUser = new ApplicationUser
                    {
                        SecurityStamp = Guid.NewGuid().ToString(),
                        UserName = user.Email,
                        Email = user.Email
                    };

                    await _userManager.CreateAsync(applicationUser, password);

                    applicationUser.EmailConfirmed = true;
                    applicationUser.LockoutEnabled = false;

                    addedUserList.Add(applicationUser);
                }
            }

            if (addedUserList.Any())
                await _context.SaveChangesAsync();

            return new JsonResult(new
            {
                Count = addedUserList.Count,
                Users = addedUserList
            });
        }
    }
}