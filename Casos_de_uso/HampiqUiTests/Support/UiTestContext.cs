using HampiqUiTests.Config;
using HampiqUiTests.Factories;
using OpenQA.Selenium;

namespace HampiqUiTests.Support;

/// <summary>
/// Administra el ciclo de vida del WebDriver con el patrón <see cref="IDisposable"/>
/// (igual que en el Laboratorio 2). Cada test crea su propio contexto: abre el
/// navegador, lo maximiza y navega a la URL base de HAMPIQ; al salir del bloque
/// <c>using</c> se llama a <see cref="Dispose"/>, que cierra el navegador y libera
/// el driver para no saturar la memoria con instancias colgadas.
///
/// Usamos espera explícita (WebDriverWait en los Page Objects) en lugar de un
/// ImplicitWait global para no mezclar ambos tipos de espera, que es la práctica
/// recomendada por Selenium; por eso el ImplicitWait se deja en cero.
/// </summary>
public sealed class UiTestContext : IDisposable
{
    public IWebDriver Driver { get; }
    public TestSettings Settings { get; }

    public UiTestContext(TestSettings settings)
    {
        Settings = settings;
        Driver = WebDriverFactory.Create(settings);
        Driver.Manage().Window.Maximize();
        Driver.Manage().Timeouts().ImplicitWait = TimeSpan.Zero;
        Driver.Navigate().GoToUrl(settings.BaseUrl);
    }

    /// <summary>
    /// Guarda una captura de pantalla como evidencia. Solo actúa si la variable de
    /// entorno <c>HAMPIQ_EVIDENCE_DIR</c> apunta a una carpeta; en una ejecución
    /// normal desde Visual Studio es un no-op, para no ensuciar el disco.
    /// </summary>
    public void Capturar(string nombre)
    {
        var dir = Environment.GetEnvironmentVariable("HAMPIQ_EVIDENCE_DIR");
        if (string.IsNullOrWhiteSpace(dir))
            return;
        Directory.CreateDirectory(dir);
        var captura = ((ITakesScreenshot)Driver).GetScreenshot();
        captura.SaveAsFile(Path.Combine(dir, nombre + ".png"));
    }

    public void Dispose()
    {
        Driver.Quit();
        Driver.Dispose();
    }
}
