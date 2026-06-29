using FluentAssertions;
using HampiqUiTests.PageObjects;
using HampiqUiTests.Support;

namespace HampiqUiTests.Tests;

/// <summary>
/// CP-04 · Registro de paciente (CU-01). El flujo principal valida que el sistema
/// verifique la identidad contra RENIEC y autocomplete los datos oficiales; el flujo
/// alterno valida el control de formato del DNI.
///
/// Nota: se prueba la verificación RENIEC (idempotente) en lugar de crear la cuenta,
/// porque registrar consumiría el DNI y la prueba no sería re-ejecutable.
/// </summary>
[TestFixture]
public class RegisterTests : TestBase
{
    [Test]
    [Description("CP-04 · Flujo principal: validar un DNI en RENIEC autocompleta los datos oficiales.")]
    public void Registro_ValidarDniRenec_AutocompletaDatos()
    {
        using var ctx = new UiTestContext(Settings);

        var registro = new LandingPage(ctx.Driver, Settings.WaitTimeoutSeconds)
            .IrARegistro()
            .ValidarDni("08456712");

        var verificada = registro.IdentidadVerificada();
        ctx.Capturar("CP-04-flujo-principal-renec");

        verificada.Should().BeTrue("RENIEC debe verificar la identidad y mostrar los datos oficiales");
        registro.ObtenerNombres().Should().Contain("Pedro");
    }

    [Test]
    [Description("CP-04 · Flujo alterno: un DNI con formato inválido muestra error de validación.")]
    public void Registro_DniConFormatoInvalido_MuestraError()
    {
        using var ctx = new UiTestContext(Settings);

        var registro = new LandingPage(ctx.Driver, Settings.WaitTimeoutSeconds)
            .IrARegistro()
            .ValidarDni("123");

        var error = registro.ObtenerError();
        ctx.Capturar("CP-04-flujo-alterno-error");

        error.Should().Contain("8 dígitos");
    }
}
