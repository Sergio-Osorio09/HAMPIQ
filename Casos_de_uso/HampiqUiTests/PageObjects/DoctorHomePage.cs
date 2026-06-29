using OpenQA.Selenium;

namespace HampiqUiTests.PageObjects;

/// <summary>Pantalla de inicio del médico (tras iniciar sesión con rol médico).</summary>
public class DoctorHomePage : BasePage
{
    public DoctorHomePage(IWebDriver driver, int waitSeconds) : base(driver, waitSeconds) { }

    public bool EstaCargado()
    {
        try { return WaitVisible(Tid("doctor-home")).Displayed; }
        catch (WebDriverTimeoutException) { return false; }
    }

    public DoctorAccessPage IrAccesoPorToken()
    {
        Click(Tid("nav-doctor"));
        return new DoctorAccessPage(Driver, WaitSeconds);
    }
}
