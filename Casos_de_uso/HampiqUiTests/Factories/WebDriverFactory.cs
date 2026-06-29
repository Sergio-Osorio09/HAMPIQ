using HampiqUiTests.Config;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Firefox;

namespace HampiqUiTests.Factories;

/// <summary>
/// Crea el <see cref="IWebDriver"/> del navegador indicado en appsettings.json.
/// Tal como en el Laboratorio 2, el nombre del navegador se normaliza a minúsculas
/// para evitar errores de mayúsculas/minúsculas en la configuración.
///
/// No hace falta descargar manualmente ChromeDriver.exe: Selenium Manager (incluido
/// desde Selenium 4.6) detecta la versión de Chrome instalada y descarga el driver
/// adecuado automáticamente.
/// </summary>
public static class WebDriverFactory
{
    public static IWebDriver Create(TestSettings settings)
    {
        var browser = (settings.Browser ?? "chrome").Trim().ToLowerInvariant();
        return browser switch
        {
            "chrome" => new ChromeDriver(BuildChromeOptions(settings.Headless)),
            "edge" => new EdgeDriver(),
            "firefox" => new FirefoxDriver(),
            _ => throw new NotSupportedException($"El navegador '{settings.Browser}' no está soportado."),
        };
    }

    private static ChromeOptions BuildChromeOptions(bool headless)
    {
        var options = new ChromeOptions();
        if (headless)
            options.AddArgument("--headless=new");
        options.AddArgument("--window-size=1440,900");
        // Silencia ruido de logs en consola para que la salida del test sea legible.
        options.AddExcludedArgument("enable-logging");
        return options;
    }
}
