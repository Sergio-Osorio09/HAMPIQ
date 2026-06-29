using System.Text.RegularExpressions;
using FluentAssertions;
using HampiqUiTests.PageObjects;
using HampiqUiTests.Support;

namespace HampiqUiTests.Tests;

/// <summary>
/// CU-03 · Generación de token médico temporal. El paciente inicia sesión, abre
/// "Compartir acceso", elige duración y usos, y genera un token. Se valida que el
/// código tenga el formato oficial HMPQ-XXXX-XXXX y que se confirme su creación.
/// </summary>
[TestFixture]
public class ShareTokenTests : TestBase
{
    // Alfabeto del backend: letras A-Z y dígitos, sin caracteres ambiguos (I, L, O, 0, 1).
    private static readonly Regex FormatoToken = new(@"^HMPQ-[A-Z0-9]{4}-[A-Z0-9]{4}$");

    [Test]
    [Description("CP-02 · Flujo principal: generar un token de 30 min y 1 uso produce un código válido.")]
    public void GenerarToken_ConDuracionYUsos_CreaTokenConFormatoValido()
    {
        using var ctx = new UiTestContext(Settings);

        var share = new LandingPage(ctx.Driver, Settings.WaitTimeoutSeconds)
            .IrAIniciarSesion()
            .IniciarSesion("45872136", "hampiq123")
            .IrACompartirAcceso();

        share.SeleccionarDuracion(30)
             .SeleccionarUsos(1)
             .GenerarToken();

        // El toast aparece junto con el código; se lee primero porque se autodescarta.
        var toast = share.ObtenerMensajeToast();
        var codigo = share.ObtenerCodigoToken();
        ctx.Capturar("CP-02-flujo-principal-token");

        toast.Should().Contain("Token generado");
        FormatoToken.IsMatch(codigo).Should()
            .BeTrue($"el token '{codigo}' debe cumplir el formato HMPQ-XXXX-XXXX");
    }
}
