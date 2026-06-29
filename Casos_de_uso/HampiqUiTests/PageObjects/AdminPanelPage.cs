using OpenQA.Selenium;

namespace HampiqUiTests.PageObjects;

/// <summary>Panel general del administrador (tras iniciar sesión con rol admin).</summary>
public class AdminPanelPage : BasePage
{
    public AdminPanelPage(IWebDriver driver, int waitSeconds) : base(driver, waitSeconds) { }

    public bool EstaCargado()
    {
        try { return WaitVisible(Tid("admin-panel")).Displayed; }
        catch (WebDriverTimeoutException) { return false; }
    }
}
