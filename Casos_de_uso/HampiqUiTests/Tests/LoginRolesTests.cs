using FluentAssertions;
using HampiqUiTests.PageObjects;
using HampiqUiTests.Support;

namespace HampiqUiTests.Tests;

/// <summary>
/// CP-05 y CP-06 · Inicio de sesión por rol (CU-02). Verifican que el ruteo posterior
/// al login lleva a cada usuario a la pantalla correcta según su rol.
/// </summary>
[TestFixture]
public class LoginRolesTests : TestBase
{
    [Test]
    [Description("CP-05 · Login de médico: redirige a la pantalla de inicio del médico.")]
    public void Login_Medico_RedirigeAInicioMedico()
    {
        using var ctx = new UiTestContext(Settings);

        var home = new LandingPage(ctx.Driver, Settings.WaitTimeoutSeconds)
            .IrAIniciarSesion()
            .IniciarSesionComoMedico("40221785", "medico123");

        var cargado = home.EstaCargado();
        ctx.Capturar("CP-05-login-medico");
        cargado.Should().BeTrue("el médico debe llegar a su pantalla de inicio");
    }

    [Test]
    [Description("CP-06 · Login de administrador: redirige al panel general.")]
    public void Login_Admin_RedirigeAlPanel()
    {
        using var ctx = new UiTestContext(Settings);

        var panel = new LandingPage(ctx.Driver, Settings.WaitTimeoutSeconds)
            .IrAIniciarSesion()
            .IniciarSesionComoAdmin("10000001", "admin123");

        var cargado = panel.EstaCargado();
        ctx.Capturar("CP-06-login-admin");
        cargado.Should().BeTrue("el administrador debe llegar al panel general");
    }
}
