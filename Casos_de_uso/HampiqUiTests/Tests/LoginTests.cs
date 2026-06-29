using FluentAssertions;
using HampiqUiTests.PageObjects;
using HampiqUiTests.Support;

namespace HampiqUiTests.Tests;

/// <summary>
/// CU-02 · Inicio de sesión. Verifica que un paciente con credenciales válidas
/// llega a su panel, y que con credenciales inválidas el sistema muestra el mensaje
/// de error sin dejarlo entrar.
/// </summary>
[TestFixture]
public class LoginTests : TestBase
{
    [Test]
    [Description("CP-01 · Flujo principal: login válido del paciente lo lleva a su dashboard.")]
    public void Login_ConCredencialesValidas_RedirigeAlDashboard()
    {
        using var ctx = new UiTestContext(Settings);
        var landing = new LandingPage(ctx.Driver, Settings.WaitTimeoutSeconds);

        var dashboard = landing
            .IrAIniciarSesion()
            .IniciarSesion("45872136", "hampiq123");

        var cargado = dashboard.EstaCargado();
        ctx.Capturar("CP-01-flujo-principal-dashboard");

        cargado.Should().BeTrue("el paciente debe llegar a su panel tras autenticarse");
        dashboard.ObtenerNombreUsuario().Should().Contain("Juan");
    }

    [Test]
    [Description("CP-01 · Flujo alterno: credenciales incorrectas muestran error y no autentican.")]
    public void Login_ConCredencialesInvalidas_MuestraMensajeDeError()
    {
        using var ctx = new UiTestContext(Settings);

        var login = new LandingPage(ctx.Driver, Settings.WaitTimeoutSeconds)
            .IrAIniciarSesion()
            .IntentarIniciarSesion("45872136", "claveIncorrecta");

        var error = login.ObtenerMensajeError();
        ctx.Capturar("CP-01-flujo-alterno-error");

        error.Should().Be("DNI o contraseña incorrectos.");
    }
}
