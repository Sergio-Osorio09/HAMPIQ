using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace HampiqUiTests.PageObjects;

/// <summary>
/// Base de todos los Page Objects. Guarda el driver y ofrece utilidades de espera
/// explícita (<see cref="WebDriverWait"/>) para que los tests sean estables aunque
/// la SPA de HAMPIQ tarde en renderizar o el backend en responder, sin recurrir a
/// <c>Thread.Sleep</c>.
///
/// Todos los elementos se localizan por el atributo <c>data-testid</c>, un selector
/// estable que añadimos a HAMPIQ pensado específicamente para pruebas (no cambia con
/// el estilo ni con el texto visible).
/// </summary>
public abstract class BasePage
{
    protected readonly IWebDriver Driver;
    protected readonly int WaitSeconds;
    protected readonly WebDriverWait Wait;

    protected BasePage(IWebDriver driver, int waitSeconds)
    {
        Driver = driver;
        WaitSeconds = waitSeconds;
        Wait = new WebDriverWait(driver, TimeSpan.FromSeconds(waitSeconds));
        Wait.IgnoreExceptionTypes(typeof(NoSuchElementException), typeof(StaleElementReferenceException));
    }

    /// <summary>Construye un localizador por data-testid.</summary>
    protected static By Tid(string testId) => By.CssSelector($"[data-testid='{testId}']");

    /// <summary>Espera a que el elemento exista y sea visible, y lo devuelve.</summary>
    protected IWebElement WaitVisible(By by) =>
        Wait.Until(d =>
        {
            var el = d.FindElement(by);
            return el.Displayed ? el : null;
        })!;

    /// <summary>Espera a que el elemento sea visible y esté habilitado para hacer clic.</summary>
    protected IWebElement WaitClickable(By by) =>
        Wait.Until(d =>
        {
            var el = d.FindElement(by);
            return el.Displayed && el.Enabled ? el : null;
        })!;

    protected void Type(By by, string text)
    {
        var el = WaitVisible(by);
        el.Clear();
        el.SendKeys(text);
    }

    protected void Click(By by) => WaitClickable(by).Click();
}
