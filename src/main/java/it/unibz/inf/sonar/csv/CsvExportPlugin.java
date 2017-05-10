package it.unibz.inf.sonar.csv;

import org.sonar.api.Plugin;

public class CsvExportPlugin implements Plugin {
    @Override
    public void define(Context context) {
        context.addExtension(
                CsvExportPage.class
        );
    }
}
