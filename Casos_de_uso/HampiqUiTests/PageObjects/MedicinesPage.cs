using OpenQA.Selenium;

namespace HampiqUiTests.PageObjects;

/// <summary>
/// «Buscar medicina» + comparador de farmacias. Busca un fármaco del catálogo y
/// muestra los precios por farmacia ordenados, marcando la más barata.
/// </summary>
public class MedicinesPage : BasePage
{
    public MedicinesPage(IWebDriver driver, int waitSeconds) : base(driver, waitSeconds) { }

    public MedicinesPage Buscar(string texto)
    {
        Type(Tid("med-search"), texto);
        return this;
    }

    /// <summary>Selecciona una tarjeta de resultado por el id del medicamento (p. ej. "m3").</summary>
    public MedicinesPage SeleccionarResultado(string idMedicina)
    {
        Click(Tid($"med-result-{idMedicina}"));
        return this;
    }

    public bool ComparadorVisible()
    {
        try { return WaitVisible(Tid("med-comparator")).Displayed; }
        catch (WebDriverTimeoutException) { return false; }
    }

    public bool MarcaMasBarato() => Driver.FindElements(Tid("med-cheapest")).Count > 0;
}
