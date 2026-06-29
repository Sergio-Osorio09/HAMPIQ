using FluentAssertions;
using HampiqUiTests.PageObjects;
using HampiqUiTests.Support;

namespace HampiqUiTests.Tests;

/// <summary>
/// CP-10 · Auditoría de accesos (función de soporte 5.4). Verifica que el paciente
/// puede consultar el registro inmutable de accesos a su historial.
/// </summary>
[TestFixture]
public class AuditTests : TestBase
{
    [Test]
    [Description("CP-10 · El paciente consulta su auditoría de accesos y ve registros.")]
    public void Paciente_ConsultaAuditoria_VeRegistros()
    {
        using var ctx = new UiTestContext(Settings);

        var auditoria = new LandingPage(ctx.Driver, Settings.WaitTimeoutSeconds)
            .IrAIniciarSesion()
            .IniciarSesion("45872136", "hampiq123")
            .IrAAuditoria();

        var cargado = auditoria.EstaCargado();
        var registros = auditoria.CantidadRegistros();
        ctx.Capturar("CP-10-auditoria");

        cargado.Should().BeTrue("debe mostrarse la tabla de auditoría");
        registros.Should().BeGreaterThan(0, "la auditoría debe tener al menos un registro");
    }
}
