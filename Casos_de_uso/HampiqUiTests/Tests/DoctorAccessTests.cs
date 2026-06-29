using FluentAssertions;
using HampiqUiTests.PageObjects;
using HampiqUiTests.Support;

namespace HampiqUiTests.Tests;

/// <summary>
/// CP-08 · Acceso del médico mediante token (CU-04). Prueba end-to-end entre roles:
/// el paciente genera un token y el médico, en otra sesión, lo valida y accede al
/// historial autorizado.
/// </summary>
[TestFixture]
public class DoctorAccessTests : TestBase
{
    [Test]
    [Description("CP-08 · El médico valida el token del paciente y accede a su historial.")]
    public void MedicoValidaTokenDelPaciente_AccedeAlHistorial()
    {
        using var ctx = new UiTestContext(Settings);

        // 1) El paciente inicia sesión y genera un token de acceso.
        var share = new LandingPage(ctx.Driver, Settings.WaitTimeoutSeconds)
            .IrAIniciarSesion()
            .IniciarSesion("45872136", "hampiq123")
            .IrACompartirAcceso();
        share.SeleccionarDuracion(30).SeleccionarUsos(1).GenerarToken();
        var codigo = share.ObtenerCodigoToken();

        // 2) Cierra sesión e inicia como médico; va a «Acceso por token».
        var acceso = share.CerrarSesion()
            .IrAIniciarSesion()
            .IniciarSesionComoMedico("40221785", "medico123")
            .IrAccesoPorToken();

        // 3) Valida el token del paciente y accede al historial.
        acceso.IngresarToken(codigo);
        var concedido = acceso.AccesoConcedido();
        ctx.Capturar("CP-08-medico-accede-historial");

        concedido.Should().BeTrue("con un token válido el médico debe acceder al historial");
        acceso.ObtenerBannerAcceso().Should().Contain("Juan Carlos Pérez");
    }
}
