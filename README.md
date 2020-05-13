# ASP.NET Identity Administration Tool
Administration tool to manage all the security settings for ASP.NET Identity application.

## Requirements
1. Visual Studio 2019
1. Visual Studio Code *(optional)*
1. SQL Server *(optional)*
1. [ASP.NET Core](https://dotnet.microsoft.com/download)
1. [Node.js](https://nodejs.org/)
1. [Angular CLI](https://cli.angular.io/)

## Create Application from Scratch

* Create ASP.NET Core application with Angular template
  * Project name: `AspIdAdmin.Web`
  * Location: `C:\Projects\AspNet-Identity-Administration-Tool`
  * Solution name: `AspIdAdmin`
  * Authentication: `Individual User Accounts`
  * Advanced: configure for HTTPS
* Optiona: close the Visual Studio and rename *AspIdAdmin* folder to *src* for Git repository
* Start debugger (F5) in Visual Studio

![](images/create-project.png)

### Install Angular Material and Flex-Layout

```console
c:\...\AspIdAdmin.Web\ClientApp
λ ng add @angular/material
? Choose a prebuilt theme name...: Indigo/Pink
? Set up global Angular Material typography styles? Yes
? Set up browser animations for Angular Material? Yes

λ npm i @angular/flex-layout --save
```

### Create Angular Modules, Services and Components

```console
ng g m angular-material --flat
```