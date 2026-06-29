using FluentAssertions;
using HampiqUiTests.PageObjects;
using HampiqUiTests.Support;

namespace HampiqUiTests.Tests;

/// <summary>
/// CU-05 · Modo emergencia (sin login). El flujo principal simula el escaneo del QR
/// del paciente y comprueba que solo se exponen los datos vitales; el flujo alterno
/// verifica que un código inexistente muestra error y NO revela información alguna.
/// </summary>
[TestFixture]
public class EmergencyTests : TestBase
{
    [Test]
    [Description("CP-03 · Flujo principal: el escaneo válido del QR revela solo los datos vitales. " +
                 "Requiere el backend con HAMPIQ_DEMO_EMERGENCY=1.")]
    public void Emergencia_SimularEscaneoQr_MuestraSoloDatosVitales()
    {
        using var ctx = new UiTestContext(Settings);

        var emergencia = new LandingPage(ctx.Driver, Settings.WaitTimeoutSeconds)
            .IrAEmergencia()
            .SimularEscaneoQr();

        var visibles = emergencia.EsperarDatosVitales();
        ctx.Capturar("CP-03-flujo-principal-vitales");

        visibles.Should().BeTrue("el escaneo válido debe mostrar la tarjeta de datos vitales del paciente");
        emergencia.ObtenerGrupoSanguineo().Should().Be("O+");
        emergencia.ObtenerAlergias().Should().Contain("Penicilina");
    }

    [Test]
    [Description("CP-03 · Flujo alterno: un código de emergencia inexistente muestra error y no revela datos.")]
    public void Emergencia_CodigoInvalido_MuestraErrorYNoRevelaDatos()
    {
        using var ctx = new UiTestContext(Settings);

        var emergencia = new LandingPage(ctx.Driver, Settings.WaitTimeoutSeconds)
            .IrAEmergencia()
            .IngresarCodigo("EMG-00000000");

        var error = emergencia.ObtenerMensajeError();
        ctx.Capturar("CP-03-flujo-alterno-error");

        error.Should().Contain("inválido");
        emergencia.HayDatosVitales().Should().BeFalse("nunca deben mostrarse datos con un código inválido");
    }
}
