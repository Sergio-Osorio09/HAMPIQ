using OpenQA.Selenium;

namespace HampiqUiTests.PageObjects;

/// <summary>Auditoría de accesos del paciente: registro inmutable de cada acción.</summary>
public class AuditPage : BasePage
{
    public AuditPage(IWebDriver driver, int waitSeconds) : base(driver, waitSeconds) { }

    public bool EstaCargado()
    {
        try { return WaitVisible(Tid("audit-list")).Displayed; }
        catch (WebDriverTimeoutException) { return false; }
    }

    public int CantidadRegistros() => Driver.FindElements(Tid("audit-row")).Count;
}
