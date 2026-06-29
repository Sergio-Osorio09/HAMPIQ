using OpenQA.Selenium;

namespace HampiqUiTests.PageObjects;

/// <summary>
/// Pantalla de modo emergencia (CU-05), accesible sin iniciar sesión. Permite
/// simular el escaneo del QR del paciente (flujo principal) o ingresar un código
/// manualmente, y comprueba que solo se exponen los datos vitales.
/// </summary>
public class EmergencyPage : BasePage
{
    public EmergencyPage(IWebDriver driver, int waitSeconds) : base(driver, waitSeconds) { }

    /// <summary>
    /// Pulsa "Simular escaneo de QR". Requiere que el backend corra con
    /// HAMPIQ_DEMO_EMERGENCY=1 para que resuelva el código del paciente semilla.
    /// </summary>
    public EmergencyPage SimularEscaneoQr()
    {
        Click(Tid("emg-scan"));
        return this;
    }

    public EmergencyPage IngresarCodigo(string codigo)
    {
        Type(Tid("emg-code"), codigo);
        Click(Tid("emg-submit"));
        return this;
    }

    /// <summary>Espera (hasta el timeout) a que aparezca la tarjeta de datos vitales.</summary>
    public bool EsperarDatosVitales()
    {
        try { return WaitVisible(Tid("emg-vitals")).Displayed; }
        catch (WebDriverTimeoutException) { return false; }
    }

    /// <summary>Comprueba de inmediato (sin esperar) si hay datos vitales en pantalla.</summary>
    public bool HayDatosVitales() => Driver.FindElements(Tid("emg-vitals")).Count > 0;

    public string ObtenerGrupoSanguineo() => WaitVisible(Tid("emg-blood-group")).Text.Trim();

    public string ObtenerAlergias() => WaitVisible(Tid("emg-allergies")).Text.Trim();

    public string ObtenerMensajeError() => WaitVisible(Tid("emg-error")).Text.Trim();
}
