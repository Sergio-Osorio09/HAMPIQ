using HampiqUiTests.Config;
using Microsoft.Extensions.Configuration;

namespace HampiqUiTests;

/// <summary>
/// Clase base de todas las clases de prueba. Lee <c>appsettings.json</c> una sola
/// vez (con <c>[OneTimeSetUp]</c>) antes de ejecutar los tests del fixture y expone
/// la configuración ya enlazada a un objeto <see cref="TestSettings"/>. Las clases
/// de test heredan de ella para acceder a <see cref="Settings"/>.
/// </summary>
public abstract class TestBase
{
    protected static TestSettings Settings { get; private set; } = new();

    [OneTimeSetUp]
    public void CargarConfiguracion()
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
            .Build();

        Settings = config.GetSection("AutomationSettings").Get<TestSettings>() ?? new TestSettings();

        // Permite forzar modo headless desde el entorno (p. ej. integración continua)
        // sin editar appsettings.json: HAMPIQ_HEADLESS=1.
        if (Environment.GetEnvironmentVariable("HAMPIQ_HEADLESS") == "1")
            Settings.Headless = true;
    }
}
