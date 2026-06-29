namespace HampiqUiTests.Config;

/// <summary>
/// Configuración de la ejecución de las pruebas, leída desde <c>appsettings.json</c>
/// (sección "AutomationSettings"). Permite cambiar el navegador, la URL de HAMPIQ
/// y los tiempos de espera sin tocar el código de los tests, igual que en el
/// Laboratorio 2 de Selenium.
/// </summary>
public class TestSettings
{
    /// <summary>Navegador a usar: "chrome", "edge" o "firefox".</summary>
    public string Browser { get; set; } = "chrome";

    /// <summary>URL base del frontend de HAMPIQ (Vite levanta por defecto el 5173).</summary>
    public string BaseUrl { get; set; } = "http://localhost:5173";

    /// <summary>Segundos máximos de espera explícita para que la SPA/el backend respondan.</summary>
    public int WaitTimeoutSeconds { get; set; } = 15;

    /// <summary>Si es true, Chrome se ejecuta sin ventana (útil en integración continua).</summary>
    public bool Headless { get; set; }
}
